// SPDX-License-Identifier: MIT
// Copyright (c) 2018 The Officious BokkyPooBah / Bok Consulting Pty Ltd

pragma solidity ^0.8.0;

struct Date {
    uint256 year;
    uint256 month;
    uint256 day;
    uint256 hour;
    uint256 minute;
    uint256 second;
}

library DateTime {
    // for datetime conversion.
    uint256 private constant SECONDS_PER_DAY = 24 * 60 * 60;
    uint256 private constant SECONDS_PER_HOUR = 60 * 60;
    uint256 private constant SECONDS_PER_MINUTE = 60;
    int256 constant OFFSET19700101 = 2440588;

    function timestampToDateTime(uint256 timestamp) internal pure returns (Date memory) {
        (uint256 year, uint256 month, uint256 day) = _daysToDate(timestamp / SECONDS_PER_DAY);
        uint256 secs = timestamp % SECONDS_PER_DAY;
        uint256 hour = secs / SECONDS_PER_HOUR;
        secs = secs % SECONDS_PER_HOUR;
        uint256 minute = secs / SECONDS_PER_MINUTE;
        uint256 second = secs % SECONDS_PER_MINUTE;

        return Date(year, month, day, hour, minute, second);
    }

    // ------------------------------------------------------------------------
    // Calculate year/month/day from the number of days since 1970/01/01 using
    // the date conversion algorithm from
    //   http://aa.usno.navy.mil/faq/docs/JD_Formula.php
    // and adding the offset 2440588 so that 1970/01/01 is day 0
    //
    // int L = days + 68569 + offset
    // int N = 4 * L / 146097
    // L = L - (146097 * N + 3) / 4
    // year = 4000 * (L + 1) / 1461001
    // L = L - 1461 * year / 4 + 31
    // month = 80 * L / 2447
    // dd = L - 2447 * month / 80
    // L = month / 11
    // month = month + 2 - 12 * L
    // year = 100 * (N - 49) + year + L
    // ------------------------------------------------------------------------
    function _daysToDate(uint256 _days)
        internal
        pure
        returns (
            uint256 year,
            uint256 month,
            uint256 day
        )
    {
        int256 __days = int256(_days);

        int256 L = __days + 68569 + OFFSET19700101;
        int256 N = (4 * L) / 146097;
        L = L - (146097 * N + 3) / 4;
        int256 _year = (4000 * (L + 1)) / 1461001;
        L = L - (1461 * _year) / 4 + 31;
        int256 _month = (80 * L) / 2447;
        int256 _day = L - (2447 * _month) / 80;
        L = _month / 11;
        _month = _month + 2 - 12 * L;
        _year = 100 * (N - 49) + _year + L;

        year = uint256(_year);
        month = uint256(_month);
        day = uint256(_day);
    }

    function isLeapYear(uint256 timestamp) internal pure returns (bool leapYear) {
        (uint256 year, , ) = _daysToDate(timestamp / SECONDS_PER_DAY);
        leapYear = _isLeapYear(year);
    }

    function _isLeapYear(uint256 year) internal pure returns (bool leapYear) {
        leapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    }
}
