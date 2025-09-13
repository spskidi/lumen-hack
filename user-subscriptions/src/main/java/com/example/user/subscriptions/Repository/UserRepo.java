package com.example.user.subscriptions.Repository;

import com.example.user.subscriptions.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, String> {
    // You can add custom query methods here if needed
}
