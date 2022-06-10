package com.mscteam.mscbackend.EAI;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Base64;

public class RemoteEaiAuth {

    private String clientId;
    private String login_uri = "http://10.20.215.10:9311/ad-gateways/verify1";

    @Autowired
    private RestTemplate restTemplate;

    public RemoteEaiAuth(String clientId) {
        this.clientId = clientId;
    }

    public String encodeTDes(UserAuth user) throws Exception{
        byte[] secretKey = "AdiNIadp9ipKWKGI5838hdfa".getBytes();
        byte[] iv = new byte[] {0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00};
        IvParameterSpec ivSpec = new IvParameterSpec(iv);

        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey, "TripleDES");
        Cipher desCipher = Cipher.getInstance("DESede/CBC/NoPadding");
        desCipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivSpec);

        byte[] cipherText = desCipher.doFinal(user.getPassword().getBytes(StandardCharsets.UTF_8));
        String encodedMsg = Base64.getEncoder().encodeToString(cipherText);
        
        return encodedMsg;
    }

    public String sendRequest(String email, String password) {
        System.out.println("Sending request to EAI Server...");
        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);
        header.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        header.add("ClientID", this.clientId);
        try{
            String[] splitted = email.split("@");
            if(splitted.length != 2) return null;
            UserAuth userAuth = new UserAuth("PAKAR", splitted[0], password);
            String encoded = this.encodeTDes(userAuth);
            System.out.println("Encoded: " + encoded);
            userAuth.renewPassword(encoded);

            HttpEntity<UserAuth> entity = new HttpEntity<UserAuth>(userAuth, header);
            String response = restTemplate.exchange(login_uri, HttpMethod.POST, entity, String.class).getBody();
            System.out.println(">> Response from EAI Login --- " + response);
            return response;
        }
        catch (Exception e) {
            System.out.println(">> Failed to contact EAI / LDAP ---");
        }
        return null;
    }
}
