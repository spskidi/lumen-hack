package com.example.user.subscriptions.Service;

import com.example.user.subscriptions.Repository.UserRepo;
import com.example.user.subscriptions.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public User getUserById(String userId) {
        return userRepo.findById(userId).orElse(null);
    }

    public User createUser(User user) {
        return userRepo.save(user);
    }

    public User updateUser(String userId, User updatedUser) {
        if (userRepo.existsById(userId)) {
            updatedUser.setUserId(userId);
            return userRepo.save(updatedUser);
        }
        return null;
    }

    public void deleteUser(String userId) {
        userRepo.deleteById(userId);
    }
}