package com.mscteam.mscbackend.UserProfile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mscteam.mscbackend.EAI.EaiLoginResponse;
import com.mscteam.mscbackend.EAI.EaiOutputSchema;
import com.mscteam.mscbackend.EAI.RemoteEaiAuth;

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
        String clientId = "CD9634C0A0212F5DE05400144FFA3B5D";
        RemoteEaiAuth auth = new RemoteEaiAuth(clientId);
        ObjectMapper mapper = new ObjectMapper();
        String response = null;
        EaiLoginResponse eaiResponse = new EaiLoginResponse();
        try {
            response = auth.sendRequest(user.getUserdomain(), user.getPassword());
            eaiResponse = mapper.readValue(response, EaiLoginResponse.class);
            Integer status = eaiResponse.getOutputSchema().getStatus();
            if(status != null && status == 0) {
                String candidateId = userProfileDAO.userAuthentication(user);
                if (candidateId != null) return candidateId;
                String props = auth.getProps(user.getUserdomain(), "2.5.4.3");
                eaiResponse = mapper.readValue(props, EaiLoginResponse.class);
                String fullname = eaiResponse.getOutputSchema().getValue().get(0);
                if(fullname == null) return null;

                props = auth.getProps(user.getUserdomain(), "0.9.2342.19200300.100.1.3");
                eaiResponse = mapper.readValue(props, EaiLoginResponse.class);
                String email = eaiResponse.getOutputSchema().getValue().get(0);
                if(email == null) return null;

                UserProfile newUser = new UserProfile(user.getUserdomain(), fullname, email, user.getPassword(), null);
                return userProfileDAO.insertUser(newUser).getUserId().toString();
            }
        } catch(Exception e) {
            System.out.println("Failed to do Authentication using EAI API-Calls ---");
        }
        return null;
    }

    public Logins getSession(String id) {
        return userProfileDAO.getSession(id);
    }

    public Logins insertSession(Logins login) {
        Logins checker = userProfileDAO.getSession(login.getUserId());
        if (checker != null) userProfileDAO.removeSession(login);
        return userProfileDAO.insertSession(login);
    }
}