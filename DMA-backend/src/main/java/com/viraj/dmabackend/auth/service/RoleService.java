package com.viraj.dmabackend.auth.service;

import com.viraj.dmabackend.auth.dto.RoleResponse;
import com.viraj.dmabackend.auth.entity.Role;
import com.viraj.dmabackend.auth.exception.RoleNotFoundException;
import com.viraj.dmabackend.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public List<RoleResponse> getAllRoles() {

        List<Role> roles = roleRepository.findAll();

        return roles.stream()
                .map(this::mapRole)
                .toList();
    }

    public RoleResponse getRoleById(String roleId) {

        Role role = findRoleById(roleId);

        return mapRole(role);
    }

    private Role findRoleById(String roleId) {

        return roleRepository.findById(roleId)
                .orElseThrow(() ->
                        new RoleNotFoundException(roleId));
    }

    private RoleResponse mapRole(Role role) {

        return RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .build();
    }
}