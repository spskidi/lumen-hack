package com.lumen.dto;
import jakarta.validation.constraints.NotNull;

public record SubscribeDto(
    @NotNull Long planId,
    boolean autoRenew
) {}
