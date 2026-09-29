package com.tienda.dto;

import com.tienda.model.PedidoItem;

public class PedidoItemResponse {
    private Long productoId;
    private String nombreProducto;
    private double precioUnitario;
    private int cantidad;

    public static PedidoItemResponse from(PedidoItem i) {
        PedidoItemResponse r = new PedidoItemResponse();
        r.productoId = i.getProducto() != null ? i.getProducto().getId() : null;
        r.nombreProducto = i.getNombreProducto();
        r.precioUnitario = i.getPrecioUnitario();
        r.cantidad = i.getCantidad();
        return r;
    }

    public Long getProductoId() { return productoId; }
    public String getNombreProducto() { return nombreProducto; }
    public double getPrecioUnitario() { return precioUnitario; }
    public int getCantidad() { return cantidad; }
}
