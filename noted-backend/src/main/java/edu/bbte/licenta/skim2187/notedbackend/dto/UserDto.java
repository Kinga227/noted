package edu.bbte.licenta.skim2187.notedbackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    @NotNull
    private String email;

    @NotNull
    private String password;

    @NotNull
    private String fullName;
}
