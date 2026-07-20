package com.viraj.dmabackend.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class RoleResponse {

    private String id;

    private String name;

    private String description;
}
