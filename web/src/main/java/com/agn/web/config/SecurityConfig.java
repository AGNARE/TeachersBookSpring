package com.agn.web.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Map<String, String> USER_ROLES = Map.of(
            "admin", "ADMIN",
            "argen", "USER",
            "testuser", "USER"
    );

    @Bean
    public InMemoryUserDetailsManager userDetailsService() {

        List<UserDetails> users = USER_ROLES.entrySet()
                .stream()
                .map(entry -> User
                        .withUsername(entry.getKey())
                        .password("{noop}1234") // простой пароль (без шифрования)
                        .roles(entry.getValue())
                        .build())
                .toList();

        return new InMemoryUserDetailsManager(users);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth

                        .requestMatchers("/", "/login").permitAll()
                        .requestMatchers(
                                "/groups/create",
                                "/groups/edit/**",
                                "/groups/update/**",
                                "/groups/delete/**",
                                "/students/create",
                                "/students/save",
                                "/students/edit/**",
                                "/students/update/**",
                                "/students/delete/**"
                        ).hasRole("ADMIN")

                        // Доступно и админу, и юзеру
                        .requestMatchers(
                                "/groups",
                                "/groups/view/**",
                                "/students",
                                "/students/view/**"
                        ).hasAnyRole("ADMIN", "USER")

                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .defaultSuccessUrl("/dashboard", true)
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login?logout")
                        .permitAll()
                )
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
