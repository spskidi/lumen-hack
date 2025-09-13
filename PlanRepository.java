package com.lumen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lumen.entity.Plan;

public interface PlanRepository extends JpaRepository<Plan, Long> {
    Optional<Plan> findByPlanName(String planName);
}
