package com.example.subscription.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "plans")
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("planType")
    @Column(nullable = false)
    private String type; // Static, Standard, Premium

    @JsonProperty("planName")
    @Column(nullable = false)
    private String name;

    private String description;

    private double price;

    @Column(name = "duration_in_months")
    private int durationInMonths; // Store as 1, 3, 6, 12

    // Transient field for JSON mapping
    @Transient
    @JsonProperty("duration")
    private String durationString;

    // Constructors
    public Plan() {}

    public Plan(String type, String name, double price, int durationInMonths, String description) {
        this.type = type;
        this.name = name;
        this.price = price;
        this.durationInMonths = durationInMonths;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getDurationInMonths() { return durationInMonths; }
    public void setDurationInMonths(int durationInMonths) { this.durationInMonths = durationInMonths; }

    public String getDurationString() {
        switch (durationInMonths) {
            case 1: return "1 month";
            case 3: return "3 months";
            case 6: return "6 months";
            case 12: return "12 months"; // or "1 year"
            default: return durationInMonths + " months";
        }
    }

    public void setDurationString(String durationString) {
        if (durationString.contains("1 year") || durationString.contains("12")) {
            this.durationInMonths = 12;
        } else if (durationString.contains("6")) {
            this.durationInMonths = 6;
        } else if (durationString.contains("3")) {
            this.durationInMonths = 3;
        } else if (durationString.contains("1")) {
            this.durationInMonths = 1;
        } else {
            this.durationInMonths = 0;
        }
    }
}
