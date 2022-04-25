package com.mscteam.mscbackend.UserProfile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileDAO userProfileDAO;

    @Autowired
    public UserProfileService(UserProfileDAO userProfileDAO) {
        this.userProfileDAO = userProfileDAO;
    }

    public List<UserProfile> getAllUserProfiles() {
        return userProfileDAO.getAllUsers();
    }

    public Optional<UserProfile> getUserProfile(String id) {
        return userProfileDAO.getUserById(id);
    }

    public UserProfile insertUserProfile(UserProfile user) {
        return userProfileDAO.insertUser(user);
    }

    public int deleteUser(String id) {
        return userProfileDAO.deleteUser(id);
    }

    public int updateUser(String id, UserProfile toBeUpdated) {
        return userProfileDAO.updateUser(id, toBeUpdated);
    }

    public String userAuthentication(UserProfile user) {
        return userProfileDAO.userAuthentication(user);
    }
}