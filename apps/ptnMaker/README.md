# Pattern-Maker 

Pattern Maker is a kind of flip-book app that consists a set of pixel patterns from 7x5 to 10x10.
You can make your own flip-book by drafting the patterns frame by frame. (see examples)

functions:
+ enable/disable led pixel (click listener) of a pattern
+ select pixel shape and/or color
+ select a static number of rows and columns from Nx7x5 to Nx10x10
+ create a sequence of patterns 
+ select id by clicking on a pattern snapshot and choose function by radio button (draft, insert, remove):
		=> insert one after current Id an empty pattern 
		=> remove a certain pattern by current Id 
		=> draft/edit pattern of current Id and save (draft mode) or append/push new pattern in array.
+ loop array via interval, move interval slider 50ms to 1s to pass/pause the whole array. 
+ store current pattern sequence in LS and/or save as binary array string (json)
+ upload/append pattern sequence (browse... upload: remove all, select json file or append: upload more than once json files with same row and column, without remove all, eg. append hello.json with world.json)	
