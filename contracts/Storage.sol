// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract Storage {
    uint8 public a = 7;  // 1 byte
    uint16 public b = 10; // 2 bytes
    address public c = 0x84295B3CB44907b9c8A2D1d08C2eD63F93Dc5787; //20 bytes
    bool d = true; // 1 byte
    uint64 public e = 15; // 8 bytes
    
    //32 bytes
    // 0x0f0184295b3cb44907b9c8a2d1d08c2ed63f93dc5787000a07

    uint256 public f = 200; // 32 bytes
    
    uint8 public g = 40; // 1 byte
    uint256 public h = 789; // 32 bytes
}