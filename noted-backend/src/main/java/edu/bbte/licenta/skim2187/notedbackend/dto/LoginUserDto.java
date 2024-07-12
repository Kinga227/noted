package edu.bbte.licenta.skim2187.notedbackend.dto;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class LoginUserDto {

    @Id
    @NotNull
    @Column(length = 50)
    private String email;

    @Column(nullable = false)
    @NotNull
    private String password;
}
