package com.agn.web.controller.schedule;

import com.agn.web.dto.schedule.ScheduleItemDTO;
import com.agn.web.entity.schedule.ScheduleItem;
import com.agn.web.service.schedule.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
@Validated
public class ScheduleController {

    private final ScheduleService scheduleService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<ScheduleItem>> getAll() {
        return ResponseEntity.ok(scheduleService.getAll());
    }

    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<List<ScheduleItem>> getByDate(@PathVariable String date) {
        LocalDate parsed = LocalDate.parse(date);
        return ResponseEntity.ok(scheduleService.getByDate(parsed));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ScheduleItem> getById(@PathVariable Long id) {
        return ResponseEntity.ok(scheduleService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ScheduleItem> create(@Valid @RequestBody ScheduleItemDTO dto) {
        return ResponseEntity.ok(scheduleService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<ScheduleItem> update(@PathVariable Long id, @Valid @RequestBody ScheduleItemDTO dto) {
        return ResponseEntity.ok(scheduleService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        scheduleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
