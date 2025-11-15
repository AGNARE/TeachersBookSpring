package com.agn.web.repository;

import com.agn.web.entity.GroupDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupRepository extends JpaRepository<GroupDTO, Long> {
    Optional<GroupDTO> findByName(String name);
}