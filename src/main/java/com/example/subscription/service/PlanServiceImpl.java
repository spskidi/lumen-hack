package com.example.subscription.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.subscription.model.Plan;
import com.example.subscription.repository.PlanRepository;

@Service
public class PlanServiceImpl implements PlanService {

    private final PlanRepository planRepository;

    public PlanServiceImpl(PlanRepository planRepository) {
        this.planRepository = planRepository;
    }

    @Override
    public List<Plan> getAllPlans() {
        return planRepository.findAll();
    }

    @Override
    public Optional<Plan> getPlanById(Long id) {
        return planRepository.findById(id);
    }

    @Override
    public Plan createPlan(Plan plan) {
        // Save all fields including planType
        return planRepository.save(plan);
    }

    @Override
    public Plan updatePlan(Long id, Plan plan) {
        return planRepository.findById(id)
                .map(existingPlan -> {
                    existingPlan.setType(plan.getType());             // Plan Type
                    existingPlan.setName(plan.getName());             // Plan Name
                    existingPlan.setDescription(plan.getDescription()); // Description
                    existingPlan.setPrice(plan.getPrice());           // Price
                    existingPlan.setDurationInMonths(plan.getDurationInMonths()); // Duration
                    return planRepository.save(existingPlan);
                })
                .orElseThrow(() -> new RuntimeException("Plan not found with id " + id));
    }

    @Override
    public void deletePlan(Long id) {
        if (!planRepository.existsById(id)) {
            throw new RuntimeException("Plan not found with id " + id);
        }
        planRepository.deleteById(id);
    }
}
