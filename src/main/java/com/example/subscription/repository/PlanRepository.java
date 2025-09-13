package com.example.subscription.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.subscription.model.Plan;

@Repository
public interface PlanRepository extends JpaRepository<Plan, Long> {
}
