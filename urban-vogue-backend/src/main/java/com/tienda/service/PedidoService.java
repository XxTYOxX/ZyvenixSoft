package com.tienda.service;

import com.tienda.dto.PedidoItemRequest;
import com.tienda.dto.PedidoRequest;
import com.tienda.model.Pedido;
import com.tienda.model.PedidoItem;
import com.tienda.model.Producto;
import com.tienda.model.Usuario;
import com.tienda.model.UsuarioFinal;
import com.tienda.repository.PedidoRepository;
import com.tienda.repository.ProductoRepository;
import com.tienda.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final Random random = new Random();

    public PedidoService(PedidoRepository pedidoRepository, ProductoRepository productoRepository,
                          UsuarioRepository usuarioRepository) {
        this.pedidoRepository = pedidoRepository;
        this.productoRepository = productoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public Pedido crear(PedidoRequest req) {
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new IllegalArgumentException("El pedido no tiene productos");
        }

        Pedido pedido = new Pedido();
        pedido.setNumero(generarNumero());
        pedido.setMetodoPago(req.getMetodoPago());
        pedido.setNombreEnvio(req.getNombreEnvio());
        pedido.setDireccionEnvio(req.getDireccionEnvio());
        pedido.setCiudadEnvio(req.getCiudadEnvio());
        pedido.setZipEnvio(req.getZipEnvio());

        if (req.getUsuarioEmail() != null && !req.getUsuarioEmail().isBlank()) {
            usuarioRepository.findByEmail(req.getUsuarioEmail())
                    .filter(u -> u instanceof UsuarioFinal)
                    .map(u -> (UsuarioFinal) u)
                    .ifPresent(pedido::setUsuario);
        }

        double total = 0;
        for (PedidoItemRequest itemReq : req.getItems()) {
            Producto p = productoRepository.findById(itemReq.getProductoId())
                    .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado: " + itemReq.getProductoId()));
            p.actualizarStock(-itemReq.getCantidad());
            productoRepository.save(p);

            PedidoItem item = new PedidoItem();
            item.setProducto(p);
            item.setNombreProducto(p.getNombre());
            item.setPrecioUnitario(p.getPrecio());
            item.setCantidad(itemReq.getCantidad());
            pedido.addItem(item);

            total += p.getPrecio() * itemReq.getCantidad();
        }
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listar() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> porUsuario(String email) {
        Usuario u = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Usuario no encontrado"));
        return pedidoRepository.findByUsuarioIdOrderByFechaDesc(u.getId());
    }

    public Pedido cambiarEstado(String numero, String estado) {
        Pedido p = pedidoRepository.findByNumero(numero)
                .orElseThrow(() -> new NoSuchElementException("Pedido no encontrado: " + numero));
        p.setEstado(estado);
        return pedidoRepository.save(p);
    }

    private String generarNumero() {
        String numero;
        do {
            numero = "UV-" + (100000 + random.nextInt(900000));
        } while (pedidoRepository.findByNumero(numero).isPresent());
        return numero;
    }
}
