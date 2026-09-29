package com.tienda.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Reseña/calificación que un usuario deja sobre un Producto.
 * Relación: 1 Producto --- 0..* ComentarioCalificacion.
 */
@Entity
@Table(name = "resenas")
public class ComentarioCalificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int calificacion; // 1 a 5

    @Column(length = 1000)
    private String textoComentario;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();

    private String autorNombre;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnore
    private Producto producto;

    public ComentarioCalificacion() {
    }

    public ComentarioCalificacion(int calificacion, String textoComentario, String autorNombre) {
        setCalificacion(calificacion);
        this.textoComentario = textoComentario;
        this.autorNombre = autorNombre;
    }

    // ---- Getters y setters ----

    public Long getId() {
        return id;
    }

    public int getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(int calificacion) {
        if (calificacion < 1 || calificacion > 5) {
            throw new IllegalArgumentException("La calificación debe estar entre 1 y 5.");
        }
        this.calificacion = calificacion;
    }

    public String getTextoComentario() {
        return textoComentario;
    }

    public void setTextoComentario(String textoComentario) {
        this.textoComentario = textoComentario;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public String getAutorNombre() {
        return autorNombre;
    }

    public void setAutorNombre(String autorNombre) {
        this.autorNombre = autorNombre;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }
}
