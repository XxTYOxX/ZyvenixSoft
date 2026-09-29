package com.tienda.dto;

import com.tienda.model.ComentarioCalificacion;
import java.time.LocalDateTime;

public class ResenaResponse {
    private Long id;
    private int calificacion;
    private String textoComentario;
    private String autorNombre;
    private LocalDateTime fecha;

    public static ResenaResponse from(ComentarioCalificacion c) {
        ResenaResponse r = new ResenaResponse();
        r.id = c.getId();
        r.calificacion = c.getCalificacion();
        r.textoComentario = c.getTextoComentario();
        r.autorNombre = c.getAutorNombre();
        r.fecha = c.getFecha();
        return r;
    }

    public Long getId() { return id; }
    public int getCalificacion() { return calificacion; }
    public String getTextoComentario() { return textoComentario; }
    public String getAutorNombre() { return autorNombre; }
    public LocalDateTime getFecha() { return fecha; }
}
