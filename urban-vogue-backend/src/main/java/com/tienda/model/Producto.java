package com.tienda.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Producto de la tienda (ropa, calzado o accesorio).
 * 1 Producto --- 0..* ComentarioCalificacion.
 */
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private double precio;

    @Column(nullable = false)
    private int stock;

    /** "Hombres", "Mujeres" o "Accesorios" (coincide con las categorías del frontend). */
    @Column(nullable = false)
    private String categoria;

    private String subcategoria;

    @Column(length = 500)
    private String imagenUrl;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ComentarioCalificacion> comentarios = new ArrayList<>();

    public Producto() {
    }

    public Producto(String nombre, double precio, int stock, String categoria, String subcategoria, String imagenUrl) {
        this.nombre = nombre;
        this.precio = precio;
        this.stock = stock;
        this.categoria = categoria;
        this.subcategoria = subcategoria;
        this.imagenUrl = imagenUrl;
    }

    /** @return una descripción legible del producto (mismo método del diagrama original). */
    public String obtenerDetalles() {
        return "Producto #" + id + " - " + nombre + " | Precio: $" + precio + " | Stock: " + stock;
    }

    /** Suma (o resta, si es negativo) unidades al stock. Lanza error si queda negativo. */
    public void actualizarStock(int cantidad) {
        int nuevo = this.stock + cantidad;
        if (nuevo < 0) {
            throw new IllegalStateException("Stock insuficiente para " + nombre);
        }
        this.stock = nuevo;
    }

    public void agregarComentario(ComentarioCalificacion comentario) {
        comentario.setProducto(this);
        this.comentarios.add(comentario);
    }

    // ---- Getters y setters ----

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public double getPrecio() {
        return precio;
    }

    public void setPrecio(double precio) {
        this.precio = precio;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public String getSubcategoria() {
        return subcategoria;
    }

    public void setSubcategoria(String subcategoria) {
        this.subcategoria = subcategoria;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public List<ComentarioCalificacion> getComentarios() {
        return comentarios;
    }
}
