package com.mscteam.mscbackend.EAI;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.tomcat.util.buf.HexUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

public class RemoteEaiAuth {

    private String clientId;
    private String login_uri = "http://10.20.215.10:9311/ad-gateways/verify1";
    private String props_uri = "http://10.20.215.10:9311/ad-gateways/property-value2";

    public RemoteEaiAuth(String clientId) {
        this.clientId = clientId;
    }

    public String paddData(String orig) {
        StringBuffer buff = new StringBuffer();
        buff.append(orig);
        int paddSize = 0;
        if(orig.length() % 8 != 0) paddSize = 8 - (orig.length() % 8);
        for(int i=0; i<paddSize; i++){
            buff.append((char) 0x00);
        }
        return buff.toString();
    }

    public String encodeTDes(UserAuth user) throws Exception{
        byte[] secretKey = "AdiNIadp9ipKWKGI5838hdfa".getBytes();
        SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey, "TripleDES");
        Cipher desCipher = Cipher.getInstance("DESede/ECB/NoPadding");
        desCipher.init(Cipher.ENCRYPT_MODE, secretKeySpec);
        byte[] cipherText = desCipher.doFinal(paddData(user.getPassword()).getBytes());
        String encodedMsg = HexUtils.toHexString(cipherText);
        return encodedMsg;
    }

    public String sendRequest(String userdomain, String password) {
        System.out.println("Sending request to EAI Server...");
        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);
        header.add("ClientID", this.clientId);
        try{
            UserAuth userAuth = new UserAuth("PAKAR", userdomain, password);
            String encoded = this.encodeTDes(userAuth);
            System.out.println("Encoded: " + encoded);
            userAuth.renewPassword(encoded);

            HttpEntity<UserAuth> entity = new HttpEntity<>(userAuth, header);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(login_uri, HttpMethod.POST, entity, String.class);
            System.out.println("Response successfully sent!");
            System.out.println(">> Response from EAI Login --- " + response.getBody());
            return response.getBody();
        }
        catch (Exception e) {
            System.out.println(">> User not found on EAI / LDAP Server ---");
        }
        return null;
    }

    public String getProps(String udomain, String injectProp) {
        System.out.println("Getting properties from EAI...");
        ArrayList<String> propLists = new ArrayList<>();
        HttpHeaders header = new HttpHeaders();
        header.setContentType(MediaType.APPLICATION_JSON);
        header.add("ClientID", this.clientId);
        try {
            EaiProps props = new EaiProps(udomain, injectProp);
            HttpEntity<EaiProps> entity = new HttpEntity<>(props, header);
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(props_uri, HttpMethod.POST, entity, String.class);
            System.out.println(">> Response from EAI Props --- " + response.getBody());
            propLists.add(response.getBody());
            return response.getBody();
        }
        catch (Exception e) {
            System.out.println(">> User not found on EAI / LDAP Server ---");
        }
        return null;
    }
}
