package com.lumen.controller;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lumen.entity.Plan;
import com.lumen.service.PlanService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/plans")
@RequiredArgsConstructor
public class PlanController {

    private final PlanService planService;

    // Only ADMIN can create plans
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public Plan createPlan(@RequestBody Plan plan) {
        return planService.createPlan(plan);
    }

    // Both ADMIN and USER can view all plans
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
    public List<Plan> getAllPlans() {
        return planService.getAllPlans();
    }

    // Both ADMIN and USER can view specific plan
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN','ROLE_USER')")
    public Plan getPlan(@PathVariable Long id) {
        return planService.getPlanById(id);
    }

    // Only ADMIN can delete plans
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public String deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return "Plan deleted successfully";
    }
}
