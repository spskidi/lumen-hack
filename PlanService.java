package com.lumen.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lumen.entity.Plan;
import com.lumen.repository.PlanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PlanService {

    private final PlanRepository planRepository;

    public Plan createPlan(Plan plan) {
        // Optionally: check if plan with same name exists
        return planRepository.save(plan);
    }

    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    public Plan getPlanById(Long id) {
        return planRepository.findById(id).orElseThrow(() -> 
            new IllegalArgumentException("Plan not found with id: " + id));
    }

    public void deletePlan(Long id) {
        planRepository.deleteById(id);
    }
}
