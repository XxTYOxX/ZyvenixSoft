package com.tienda.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ResenaRequest {
    @Min(1) @Max(5)
    private int calificacion;
    @NotBlank
    private String textoComentario;
    private String autorNombre;

    public int getCalificacion() { return calificacion; }
    public void setCalificacion(int calificacion) { this.calificacion = calificacion; }
    public String getTextoComentario() { return textoComentario; }
    public void setTextoComentario(String textoComentario) { this.textoComentario = textoComentario; }
    public String getAutorNombre() { return autorNombre; }
    public void setAutorNombre(String autorNombre) { this.autorNombre = autorNombre; }
}
