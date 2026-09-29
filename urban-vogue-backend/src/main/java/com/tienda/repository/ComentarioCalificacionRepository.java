package com.tienda.repository;

import com.tienda.model.ComentarioCalificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioCalificacionRepository extends JpaRepository<ComentarioCalificacion, Long> {
    List<ComentarioCalificacion> findByProductoIdOrderByFechaDesc(Long productoId);
}
