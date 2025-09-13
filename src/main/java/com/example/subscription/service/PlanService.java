package com.example.subscription.service;

import java.util.List;
import java.util.Optional;

import com.example.subscription.model.Plan;

public interface PlanService {

    List<Plan> getAllPlans();
    Optional<Plan> getPlanById(Long id);
    Plan createPlan(Plan plan);
    Plan updatePlan(Long id, Plan plan);
    void deletePlan(Long id);
}
