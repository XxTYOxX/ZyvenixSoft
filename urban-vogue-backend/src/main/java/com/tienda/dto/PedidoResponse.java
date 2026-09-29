package com.tienda.dto;

import com.tienda.model.Pedido;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class PedidoResponse {
    private Long id;
    private String numero;
    private LocalDateTime fecha;
    private double total;
    private String metodoPago;
    private String estado;
    private String nombreEnvio;
    private String ciudadEnvio;
    private List<PedidoItemResponse> items;

    public static PedidoResponse from(Pedido p) {
        PedidoResponse r = new PedidoResponse();
        r.id = p.getId();
        r.numero = p.getNumero();
        r.fecha = p.getFecha();
        r.total = p.getTotal();
        r.metodoPago = p.getMetodoPago();
        r.estado = p.getEstado();
        r.nombreEnvio = p.getNombreEnvio();
        r.ciudadEnvio = p.getCiudadEnvio();
        r.items = p.getItems().stream().map(PedidoItemResponse::from).collect(Collectors.toList());
        return r;
    }

    public Long getId() { return id; }
    public String getNumero() { return numero; }
    public LocalDateTime getFecha() { return fecha; }
    public double getTotal() { return total; }
    public String getMetodoPago() { return metodoPago; }
    public String getEstado() { return estado; }
    public String getNombreEnvio() { return nombreEnvio; }
    public String getCiudadEnvio() { return ciudadEnvio; }
    public List<PedidoItemResponse> getItems() { return items; }
}
