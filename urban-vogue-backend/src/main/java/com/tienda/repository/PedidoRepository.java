package com.tienda.repository;

import com.tienda.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioIdOrderByFechaDesc(Long usuarioId);
    Optional<Pedido> findByNumero(String numero);
}
