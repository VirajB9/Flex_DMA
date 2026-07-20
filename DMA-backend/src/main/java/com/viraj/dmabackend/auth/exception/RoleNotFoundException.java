package com.viraj.dmabackend.auth.exception;

public class RoleNotFoundException extends RuntimeException {

    public RoleNotFoundException(String roleId) {
        super("Role not found with id: " + roleId);
    }
}
