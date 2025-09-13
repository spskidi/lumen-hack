package com.lumen.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lumen.entity.AuditLog;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Find all logs by a specific user/email
    List<AuditLog> findByPerformedBy(String performedBy);

    // Find all logs for a specific action type
    List<AuditLog> findByAction(String action);

    // Find all logs between two timestamps
    List<AuditLog> findByTimestampBetween(LocalDateTime start, LocalDateTime end);

    // Find logs by user and action
    List<AuditLog> findByPerformedByAndAction(String performedBy, String action);

    // Optional: count logs for a user
    long countByPerformedBy(String performedBy);
}
