<?php

namespace App\Enum;

enum GenderEnum: string
{
    case MALE = 'male';
    case FEMALE = 'female';
    case CROISSANT = 'croissant';

    public function getGender(): string {
        return match($this) {
            self::MALE => 'Man',
            self::FEMALE => 'Woman',
            self::CROISSANT => 'Croissant',
        };
    }

    public static function fromValue(string $value): self {
        return match($value) {
            'Man' => self::MALE,
            'Woman' => self::FEMALE,
            'Croissant' => self::CROISSANT,
            default => throw new \ValueError("Invalid gender value: $value"),
        };
    }
}
