# X-DiceMatrix 0.x (experimental)

Roll a set of x - dices in a matrix

Every diceworker is an independent object, its randomized roll length is returned by a webworker. 
Each dice object has same properties except of object ids and different random state. 

App and Test Contents=> switch between specific contents via jquery

User inputs:

+ replace array "objects" with json (webworker)
+ range xy-rangesliders instead of input text (max. 10x10), generate button removed
+ create tablematrix with dices
+ random outputs of number of dices and pts, when testing.
+ output as integer or diceface

27.09: 

+ use native import module support of newer browsers.

27.05: Test Program:

+ generate random number of dices
+ roll all dices and check expected sum 

29.05 link highlighting:
+ highlight current visited link => loop all li tags and unbold except of visited link 
+ target visited link turn into bold fonts

02.06:
+ about description added
+ hide all content except of targeted
+ additional button for testing
+ hover effect with b - tag, highlight visited with css 
