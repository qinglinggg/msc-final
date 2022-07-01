package com.mscteam.mscbackend.UserProfile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserProfileDAO {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public UserProfileDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<UserProfile> getAllUsers() {
        final String query = "SELECT userId, userDomain, fullname, email, profileImage FROM User";
        List<UserProfile> userlist = jdbcTemplate.query(query, ((resultSet, i) -> {
            String userId = resultSet.getString("userId");
            String userDomain = resultSet.getString("userDomain");
            String fullname = resultSet.getString("fullname");
            String email = resultSet.getString("email");
            String image = resultSet.getString("profileImage");
            return new UserProfile(userId, userDomain, fullname, email, null, image);
        }));
        return userlist;
    }

    public Optional<UserProfile> getUserById(String id) {
        final String query = "SELECT userId, userDomain, fullname, email, profileImage FROM User WHERE userId = ?";
        UserProfile user = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
            String userId = resultSet.getString("userId");
            String userDomain = resultSet.getString("userDomain");
            String fullname = resultSet.getString("fullname");
            String email = resultSet.getString("email");
            String image = resultSet.getString("profileImage");
            return new UserProfile(userId, userDomain, fullname, email, null, image);
        }, id);
        return Optional.ofNullable(user);
    }

    public UserProfile insertUser(UserProfile user) {
        final String query = "INSERT INTO User VALUES (?,?,?,?,?)";
        jdbcTemplate.update(query, user.getUserId().toString(), user.getUserdomain(), user.getFullname(),
                user.getEmail().toLowerCase(), user.getProfileImage());
        return user;
    }

    public int deleteUser(String id) {
        final String query = "DELETE FROM User WHERE userId = ?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public int updateUser(String id, UserProfile toBeUpdated) {
        String query = "UPDATE User SET";
        System.out.println(id);
        boolean firstCheck = false;
        if (toBeUpdated.getFullname() != "" && toBeUpdated.getFullname() != null) {
            if (firstCheck == false) {
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " fullname = '" + toBeUpdated.getFullname() + "'";
        }
        if (toBeUpdated.getEmail() != "" && toBeUpdated.getEmail() != null) {
            if (firstCheck == false) {
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " email = '" + toBeUpdated.getEmail().toLowerCase() + "'";
        }
        if (toBeUpdated.getProfileImage() != "" && toBeUpdated.getProfileImage() != null) {
            if (firstCheck == false) {
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " profileImage = '" + toBeUpdated.getProfileImage() + "'";
        }
        query += " WHERE userId = ?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public String userAuthentication(UserProfile user) {
        final String query = "SELECT userId FROM User WHERE userDomain = ?";
        List<String> res = jdbcTemplate.query(query, (resultSet, i) -> {
            String userId = resultSet.getString("userId");
            return userId;
        }, user.getUserdomain());
        System.out.println(res);
        if(res.size() > 0) {
            System.out.println("res.size > 0");
            System.out.println(res.size());
            return res.get(0);
        }
        System.out.println("res.size < 0");
        return null;
    }

    public String getUserByEmail(String userEmail) {
        final String query = "SELECT userId FROM User WHERE email = ?";
        List<String> res = jdbcTemplate.query(query, (resultSet, i) -> {
            String userId = resultSet.getString("userId");
            return userId;
        }, userEmail.toLowerCase());
        if(res.size() > 0){
            return res.get(0);
        }
        return null;
    }

    public Logins getSession(String id) {
        final String query = "SELECT * FROM LoginSessions WHERE userId = ?";
        List<Logins> resToken = jdbcTemplate.query(query, (resultSet, i) -> {
            String userId = resultSet.getString("userId");
            String bearer = resultSet.getString("bearerToken");
            return new Logins(userId, bearer);
        }, id);
        if(resToken.size() > 0) {
            Logins curData = resToken.get(0);
            return curData;
        }
        return null;
    }

    public Logins insertSession(Logins login) {
        String query = "INSERT INTO LoginSessions VALUES ('";
        query += login.getUserId() + "','";
        query += login.getBearerToken() + "')";
        jdbcTemplate.update(query);
        return login;
    }

    public Logins removeSession(Logins login) {
        String query = "DELETE FROM LoginSessions WHERE userId = ?";
        jdbcTemplate.update(query, login.getUserId());
        return login;
    }
}