package com.tienda.service;

import com.tienda.dto.ProductoCreateRequest;
import com.tienda.dto.ProductoUpdateRequest;
import com.tienda.model.ComentarioCalificacion;
import com.tienda.model.Producto;
import com.tienda.repository.ComentarioCalificacionRepository;
import com.tienda.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ComentarioCalificacionRepository resenaRepository;

    public ProductoService(ProductoRepository productoRepository, ComentarioCalificacionRepository resenaRepository) {
        this.productoRepository = productoRepository;
        this.resenaRepository = resenaRepository;
    }

    public List<Producto> listar(String categoria) {
        return (categoria == null || categoria.isBlank())
                ? productoRepository.findAll()
                : productoRepository.findByCategoria(categoria);
    }

    public Producto obtener(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Producto no encontrado: " + id));
    }

    public Producto crear(ProductoCreateRequest req) {
        Producto p = new Producto(req.getNombre(), req.getPrecio(), req.getStock(),
                req.getCategoria(), req.getSubcategoria(), req.getImagenUrl());
        return productoRepository.save(p);
    }

    public Producto actualizar(Long id, ProductoUpdateRequest req) {
        Producto p = obtener(id);
        if (req.getNombre() != null && !req.getNombre().isBlank()) {
            p.setNombre(req.getNombre());
        }
        if (req.getPrecio() != null && req.getPrecio() > 0) {
            p.setPrecio(req.getPrecio());
        }
        return productoRepository.save(p);
    }

    public Producto ajustarStock(Long id, int cantidad) {
        Producto p = obtener(id);
        p.actualizarStock(cantidad);
        return productoRepository.save(p);
    }

    public List<ComentarioCalificacion> resenas(Long productoId) {
        return resenaRepository.findByProductoIdOrderByFechaDesc(productoId);
    }

    public ComentarioCalificacion agregarResena(Long productoId, int calificacion, String texto, String autor) {
        Producto p = obtener(productoId);
        ComentarioCalificacion resena = new ComentarioCalificacion(calificacion, texto, autor);
        p.agregarComentario(resena);
        resenaRepository.save(resena);
        return resena;
    }
}
