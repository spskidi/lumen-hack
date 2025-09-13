package com.lumen.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String planType;  // Static, Standard, Premium

    @Column(nullable = false, unique = true)
    private String planName;

    @Column(nullable = false)
    private Double planPrice;

    @Column(nullable = false)
    private String planDuration;  // 1 month, 3 months, 6 months, 1 Year

    @Column(length = 500)
    private String description;
}
