package com.lumen.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lumen.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
