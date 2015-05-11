# Estimator
This is a quick-and-dirty tool for an alternative method of poker planning, usable by a distributed team.

## Usage
Load this webpage in your favorite modern web browser.  No webserver is required - it can be loaded straight off 
your filesystem if you like.

Create a new card by entering a story title in the textbox at the top of the screen.

Drag existing cards to whichever sizing you feel is appropriate.

Everyone who has this webpage open will see the same board.  When a card is changed, it'll briefly flash to let you know
that it was newly moved or created.

## Method for Story Sizing

### Phase 1 - Sizing
No discussion during the first phase of the sizing exercise.

All team members move cards around simultaneously.  Each team member simply puts a card in the column they think it
should be.  If you disagree with its placement, just move it!

If a card moves around a lot, move it to the '?' bucket.

Once the team stops moving cards around, proceed to Phase 2.

### Phase 2 - Resolve Questions
Discuss each card in the '?' bucket until the team understands enough to size the task.  After discussion, sizing can 
be determined by whatever means you like - hidden voting (as in traditional poker planning) tends to work well for this.

## Caveats
Because this was a small PoC effort, in its current incarnation there are some warnings and a few important missing 
features.  Caveat emptor.

* Cards can only be added - not deleted or updated.
* There's only a single channel for all users.  That means that there's no privacy or access control for the board.
  * If you want your own private board, you'll need to run your own [crossbar.io](http://crossbar.io) server, and update main.js's `_getRealm()` and `_getWebsocketURI()` functions accordingly.

> **IMPORTANT** - all state is saved in the clients' browsers!  When the last person closes their browser, the contents of
> the table will be lost!
