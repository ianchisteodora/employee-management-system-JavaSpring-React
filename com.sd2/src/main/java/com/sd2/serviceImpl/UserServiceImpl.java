package com.sd2.serviceImpl;

import com.sd2.JWT.CustomerUsersDetailsService;
import com.sd2.JWT.JWTUtil;
import com.sd2.JWT.JwtFilter;
import com.sd2.constents.Constants;
import com.sd2.dao.UserDao;
import com.sd2.model.User;
import com.sd2.service.UserService;
import com.sd2.utils.Utils;
import com.sd2.wrapper.UserWrapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service

public class UserServiceImpl implements UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    CustomerUsersDetailsService customerUsersDetailsService;

    @Autowired
    JWTUtil jwtUtil;

    @Autowired
    JwtFilter jwtFilter;

    @Override
    public ResponseEntity<String> signUp(Map<String, String> requestMap) {

        log.info("Inside signup{}", requestMap);
        try {
            if (validateSignUpMap(requestMap)) {

                User user = userDao.findByEmailId(requestMap.get("email"));
                if (Objects.isNull(user)) {

                    userDao.save(getUserFromMap(requestMap));
                    return Utils.getResponseEntity("Successfully registered", HttpStatus.OK);


                } else
                    return Utils.getResponseEntity("Email already exists", HttpStatus.BAD_REQUEST);

            } else {
                return Utils.getResponseEntity(Constants.inv_data, HttpStatus.BAD_REQUEST);
            }
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);


    }



    private boolean validateSignUpMap(Map<String, String> requestMap){

        if(requestMap.containsKey("name") && requestMap.containsKey("email") && requestMap.containsKey("password")){
            return true;
        }
        else
            return false;
    }

    private User getUserFromMap(Map<String, String> requestMap){
        User user = new User();
        user.setName(requestMap.get("name"));
        user.setEmail(requestMap.get("email"));
        user.setPassword(requestMap.get("password"));
        user.setStatus("false");
        user.setRole("user");
        return user;
    }

    @Override
    public ResponseEntity<String> login(Map<String, String> requestMap) {
        log.info("Inside login");

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(requestMap.get("email"), requestMap.get("password")));

            if (authentication.isAuthenticated()) {
                if (customerUsersDetailsService.getUserDetail().getStatus().equalsIgnoreCase("true")) {
                    String token = jwtUtil.generateToken(customerUsersDetailsService.getUserDetail().getEmail(), customerUsersDetailsService.getUserDetail().getRole());
                    String role = customerUsersDetailsService.getUserDetail().getRole();

                    String response = "{\"token\":\"" + token + "\", \"role\":\"" + role + "\"}";

                    return new ResponseEntity<>(response, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("{\"message\":\"Wait for admin approval!\"}", HttpStatus.BAD_REQUEST);
                }
            }
        } catch (Exception ex) {
            log.error("{}", ex);
        }

        return new ResponseEntity<>("{\"message\":\"Bad credentials!\"}", HttpStatus.BAD_REQUEST);
    }


    @Override
    public ResponseEntity<List<UserWrapper>> getAllUsers() {
        try{

            if(jwtFilter.isAdmin()){
                return new ResponseEntity<>(userDao.getAllUsers(), HttpStatus.OK);
            }else{
                return new ResponseEntity<>(new ArrayList<>(), HttpStatus.UNAUTHORIZED);
            }

        }catch(Exception e){
            e.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> update(Map<String, String> requestMap) {
        try{
            if(jwtFilter.isAdmin()){

               Optional<User> optional =  userDao.findById(Integer.parseInt(requestMap.get("id")));
                if(!optional.isEmpty()){

                    userDao.updateStatus(requestMap.get("status"), Integer.parseInt(requestMap.get("id")));
                    return Utils.getResponseEntity("User status updated successfully!", HttpStatus.OK);

                }
                else {
                    Utils.getResponseEntity("User id doesn't exist", HttpStatus.OK);

                }


            }else{
                return Utils.getResponseEntity(Constants.un_access, HttpStatus.UNAUTHORIZED);
            }

        }catch(Exception e){
            e.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> checkToken() {
       return Utils.getResponseEntity("true", HttpStatus.OK);
    }

    @Override
    public ResponseEntity<String> changePassword(Map<String, String> requestMap) {
        try{

            User user = userDao.findByEmail(jwtFilter.getCurrentUser());
            if(!user.equals(null)){

                if(user.getPassword().equals(requestMap.get("oldPassword"))){

                    user.setPassword(requestMap.get("newPassword"));
                    userDao.save(user);
                    return Utils.getResponseEntity("Password updated successfully", HttpStatus.OK);
                }
                return Utils.getResponseEntity("Incorrect old password!", HttpStatus.BAD_REQUEST);

            }
            return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);

        }catch(Exception e){
            e.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteUser(Integer id) {
        try{
            if(jwtFilter.isAdmin()){
                Optional optional =  userDao.findById(id);
                if(!optional.isEmpty()){
                    userDao.deleteById(id);
                    return Utils.getResponseEntity("User Deleted Successfully", HttpStatus.OK);
                }else{
                    return Utils.getResponseEntity("User id does not exist", HttpStatus.OK);
                }
            }else{
                return Utils.getResponseEntity(Constants.un_access, HttpStatus.UNAUTHORIZED);
            }
        }catch (Exception ex){
            ex.printStackTrace();
        }
        return Utils.getResponseEntity(Constants.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }



}
