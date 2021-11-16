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
        final String query = "SELECT userid, username, fullname, email FROM User";
        List<UserProfile> userlist = jdbcTemplate.query(query, ((resultSet, i) -> {
                String userId = resultSet.getString("userId");
                String username = resultSet.getString("username");
                String fullname = resultSet.getString("fullname");
                String email = resultSet.getString("email");
                return new UserProfile(userId, username, fullname, email, null);
            })
        );
        return userlist;
    }

    public Optional<UserProfile> getUserById(String id) {
        final String query = "SELECT userId, username, fullname, email FROM User WHERE userId = ?";
        UserProfile user = jdbcTemplate.queryForObject(query, (resultSet, i) -> {
                String userId = resultSet.getString("userId");
                String username = resultSet.getString("username");
                String fullname = resultSet.getString("fullname");
                String email = resultSet.getString("email");
                return new UserProfile(userId, username, fullname, email, null);
            }, id);

        return Optional.ofNullable(user);
    }

    public int insertUser(UserProfile user){
        System.out.println("UserProfileDAO start");
        final String query = "INSERT INTO User VALUES (?,?,?,?,?)";
        int res = jdbcTemplate.update(query, user.getUserId().toString(), user.getUsername(), user.getFullname(), user.getEmail(), user.getProfileImage());
        System.out.println("UserProfileDAO end");
        return res;
    }

    public int deleteUser(String id){
        final String query = "DELETE FROM User WHERE userId = ?";
        int res = jdbcTemplate.update(query, id);
        return res;
    }

    public int updateUser(String id, UserProfile toBeUpdated){
        String query = "UPDATE User SET";
        System.out.println(id);
        boolean firstCheck = false;
        if (toBeUpdated.getUsername() != "" && toBeUpdated.getUsername() != null){
            if(firstCheck == false){
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " username = '" + toBeUpdated.getUsername() + "'";
        }
        if (toBeUpdated.getFullname() != "" && toBeUpdated.getFullname() != null){
            if(firstCheck == false){
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " fullname = '" + toBeUpdated.getFullname() + "'";
        }
        if (toBeUpdated.getEmail() != "" && toBeUpdated.getEmail() != null){
            if(firstCheck == false){
                query += "";
                firstCheck = true;
            } else {
                query += ",";
            }
            query += " email = '" + toBeUpdated.getEmail() + "'";
        }
        if (toBeUpdated.getProfileImage() != "" &&  toBeUpdated.getProfileImage() != null){
            if(firstCheck == false){
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
}