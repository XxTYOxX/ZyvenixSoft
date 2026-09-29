package com.tienda.controller;

import com.tienda.dto.PedidoRequest;
import com.tienda.dto.PedidoResponse;
import com.tienda.model.Pedido;
import com.tienda.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody PedidoRequest req) {
        try {
            Pedido pedido = pedidoService.crear(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(PedidoResponse.from(pedido));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public List<PedidoResponse> listar() {
        return pedidoService.listar().stream().map(PedidoResponse::from).collect(Collectors.toList());
    }

    @GetMapping("/usuario/{email}")
    public ResponseEntity<?> porUsuario(@PathVariable String email) {
        try {
            List<PedidoResponse> lista = pedidoService.porUsuario(email).stream()
                    .map(PedidoResponse::from).collect(Collectors.toList());
            return ResponseEntity.ok(lista);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{numero}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable String numero, @RequestBody Map<String, String> body) {
        try {
            Pedido p = pedidoService.cambiarEstado(numero, body.get("estado"));
            return ResponseEntity.ok(PedidoResponse.from(p));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
