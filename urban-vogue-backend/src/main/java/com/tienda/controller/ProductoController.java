package com.tienda.controller;

import com.tienda.dto.*;
import com.tienda.model.ComentarioCalificacion;
import com.tienda.model.Producto;
import com.tienda.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping
    public List<ProductoDTO> listar(@RequestParam(required = false) String categoria) {
        return productoService.listar(categoria).stream().map(ProductoDTO::from).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id) {
        try {
            Producto p = productoService.obtener(id);
            return ResponseEntity.ok(ProductoDTO.from(p));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ProductoDTO> crear(@Valid @RequestBody ProductoCreateRequest req) {
        Producto p = productoService.crear(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ProductoDTO.from(p));
    }

    /** Edición desde el panel de administrador (nombre y precio). */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ProductoUpdateRequest req) {
        try {
            Producto p = productoService.actualizar(id, req);
            return ResponseEntity.ok(ProductoDTO.from(p));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    /** Ajuste de stock (por ejemplo el botón "+10" de reposición). */
    @PutMapping("/{id}/stock")
    public ResponseEntity<?> ajustarStock(@PathVariable Long id, @RequestBody StockAjusteRequest req) {
        try {
            Producto p = productoService.ajustarStock(id, req.getCantidad());
            return ResponseEntity.ok(ProductoDTO.from(p));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/resenas")
    public ResponseEntity<?> resenas(@PathVariable Long id) {
        List<ResenaResponse> lista = productoService.resenas(id).stream()
                .map(ResenaResponse::from).collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    @PostMapping("/{id}/resenas")
    public ResponseEntity<?> crearResena(@PathVariable Long id, @Valid @RequestBody ResenaRequest req) {
        try {
            ComentarioCalificacion resena = productoService.agregarResena(
                    id, req.getCalificacion(), req.getTextoComentario(), req.getAutorNombre());
            return ResponseEntity.status(HttpStatus.CREATED).body(ResenaResponse.from(resena));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}
