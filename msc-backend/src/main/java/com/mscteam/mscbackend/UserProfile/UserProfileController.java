package com.mscteam.mscbackend.UserProfile;

import java.text.ParseException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/user-profiles")
@CrossOrigin("*")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @Autowired
    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public List<UserProfile> getAllUserProfiles() {
        return userProfileService.getAllUserProfiles();
    }

    @GetMapping(value = "/{id}")
    public Optional<UserProfile> getUserProfile(@PathVariable("id") String id) {
        return userProfileService.getUserProfile(id);
    }

    @PostMapping(value = "/insert", consumes = MediaType.APPLICATION_JSON_VALUE)
    public UserProfile insertUserProfile(@RequestBody UserProfile user) throws ParseException {
        return userProfileService.insertUserProfile(user);
    }

    @DeleteMapping(value = "/{id}")
    public int deleteUserProfile(@PathVariable("id") String id) {
        return userProfileService.deleteUser(id);
    }

    @PutMapping(value = "/{id}")
    public int updateUser(@PathVariable("id") String id, @RequestBody UserProfile toBeUpdated) throws ParseException {
        return userProfileService.updateUser(id, toBeUpdated);
    }

    @PostMapping(value = "/auth", consumes=MediaType.APPLICATION_JSON_VALUE)
    public String userAuthentication(@RequestBody UserProfile user) {
        System.out.println("User authentication");
        return userProfileService.userAuthentication(user);
    }
}
