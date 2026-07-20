package com.viraj.dmabackend.auth.controller;

import com.viraj.dmabackend.auth.dto.RoleResponse;
import com.viraj.dmabackend.auth.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "3. Role Management")
@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
public class RoleController {

    private final RoleService roleService;

    @PreAuthorize("hasAuthority('user:read')")
    @GetMapping
    @Operation(summary = "Get All Roles")
    public List<RoleResponse> getAllRoles() {

        return roleService.getAllRoles();
    }

    @PreAuthorize("hasAuthority('user:read')")
    @GetMapping("/{roleId}")
    @Operation(summary = "Get Role By Id")
    public RoleResponse getRoleById(
            @PathVariable String roleId) {

        return roleService.getRoleById(roleId);
    }
}