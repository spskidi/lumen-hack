package com.lumen.dto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PlanDto(
    @NotBlank @Size(max=100) String name,
    @NotNull @DecimalMin("0.0") Double price,
    @NotNull @Min(0) Integer quotaGb,
    @Size(max=1000) String description
) {}
