package com.viraj.dmabackend.auth.bootstrap;

import com.viraj.dmabackend.auth.enmus.PermissionType;
import com.viraj.dmabackend.auth.entity.Permission;
import com.viraj.dmabackend.auth.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Order(1)
public class PermissionBootstrap implements CommandLineRunner {

    private final PermissionRepository permissionRepository;

    @Override
    public void run(String... args) {

        for (PermissionType permissionType : PermissionType.values()) {
            if (permissionRepository.existsByPermissionType(permissionType)) {
                continue;
            }

            Permission permission = Permission.builder()
                    .permissionType(permissionType)
                    .description(permissionType.name())
                    .build();

            permissionRepository.save(permission);
        }
    }
}
