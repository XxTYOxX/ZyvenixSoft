package com.tienda.dto;

/** Delta de stock: positivo para reponer (botón "+10"), negativo para descontar. */
public class StockAjusteRequest {
    private int cantidad;

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
}
