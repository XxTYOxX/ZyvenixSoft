package com.tienda.dto;

import com.tienda.model.Producto;

/** Lo que la API devuelve al listar/consultar productos. */
public class ProductoDTO {
    private Long id;
    private String nombre;
    private double precio;
    private int stock;
    private String categoria;
    private String subcategoria;
    private String imagenUrl;

    public static ProductoDTO from(Producto p) {
        ProductoDTO dto = new ProductoDTO();
        dto.id = p.getId();
        dto.nombre = p.getNombre();
        dto.precio = p.getPrecio();
        dto.stock = p.getStock();
        dto.categoria = p.getCategoria();
        dto.subcategoria = p.getSubcategoria();
        dto.imagenUrl = p.getImagenUrl();
        return dto;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public double getPrecio() { return precio; }
    public int getStock() { return stock; }
    public String getCategoria() { return categoria; }
    public String getSubcategoria() { return subcategoria; }
    public String getImagenUrl() { return imagenUrl; }
}
