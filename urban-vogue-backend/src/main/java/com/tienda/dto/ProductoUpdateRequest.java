package com.tienda.dto;

/** Edición desde el panel de administrador: nombre y precio (igual que el botón "Guardar" de Productos). */
public class ProductoUpdateRequest {
    private String nombre;
    private Double precio;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
}
