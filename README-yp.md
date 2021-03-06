# YPilot Language

YPilot's game rules and maps are described in a simple English-like language, described in this document. Files written in this language normally have the extension `.yp`. A `.yp` file contains a sequence of statements. Statements can be adjective definitions, event definitions, permission condition declarations, noun definitions, rules, or uses of other `.yp` files. A `.yp` file may also contain comments anywhere (including within statements). Comments start with a `#` character and continue until the end of the line. Comments are treated as whitespace. For the most part, any amount of whitespace is treated the same as a single space character, but there are a few situations where line breaks are significant.

TODO metadata

## Adjective definitions

An adjective definition gives a name for an adjective, optionally a list of other adjectives implied by this adjective, and then a list of properties that things described by this adjective have. Properties have a name, and optionally a type and/or a default value. Here's an example of an adjective definition:

    a Wiggly thing is Located and Mobile and has
      a frequency which is a number
      an amplitude which is a number (default 1)
      a phase which is a number (default 0)

This defines the adjective `Wiggly`, which implies the (built-in) adjectives `Located` and `Mobile`. Its properties are `frequency`, `amplitude`, and `phase`, which are all numbers. The default `amplitude` for a `Wiggly` thing is 1, and the default `phase` is 0. The `frequency` has no default, so it must be specified when a thing becomes `Wiggly`.

Note that adjectives always start with a capital letter, and properties always start with a lower case letter. Also note that where this syntax uses the word `a`, you can use `an` instead, in order to make it read more naturally.

The following is a list of ways to define properties with different types. In this list, `foo` stands in for the property name, and `Bar` is a noun or object type name. Each line has a comment after it describing its meaning.

    a foo                       # no type, anything can go in foo
    a foo which is a Bar thing  # Bar is an adjective describing the thing foo
    a foo which is a Bar object # foo instanceof Bar in JavaScript
    a foo which is a boolean    # foo is either true or false
    a foo flag                  # shorthand for the previous one
    a foo which is a number     # foo is a number, like 1, 2.3, or PI
    a number of foo             # shorthand for the previous one
    a foo which is a string     # foo is a text string, like "hello, world!"
    a foo which is an Array of Bar things # foo is an array whose elements are of the type "Bar thing"
        # (any pluralized type can go here, including another "Arrays of ...")
    some foo which are Bar things         # shorthand for the previous one

## Event definitions

An event definition gives the form of a custom event type, and optionally a list of types for the variables it uses. A custom event must have at least a subject variable and a verb. The verb serves as the name of the event type. It must be capitalized, and it should be in 3rd person present tense (e.g. `Takes`, not `Take`, `Taking`, `Taken`, or `Took`). The event may also have a single object variable after the verb, a list of preposition/variable pairs, and/or adjective-like property/variable pairs following `with`. Prepositions and properties are interchangeable, they just allow for more natural reading.

Event definitions may take one of two forms, depending on whether a type list is included. Without a type list, the event goes between `the event` and `can happen`:

    # simplest
    the event ?subject Verbs can happen
    # most complex
    the event
      ?subject
      Verbs
      ?object
      prep1 ?val1 prep2 ?val2
      with prop3 ?val3 and prop4 ?val4
    can happen

With a type list, the event goes between `in the event` and `then`, and the type list comes after `then`:

    in the event ?subject Verbs then
      ?subject is a Verbing thing

The types are similar to those used for adjective properties, except that the shorthand forms for `flag`s and `number`s are not allowed, and the `a foo` or `some foo` part at the beginning (identifying the property the type applies to) is replaced with the variable that the type applies to.

An event defined in this way may be used as an effect to emit the event, and it may be used as the triggering event of a rule.

A real example of a custom event type may be seen in `gun.yp`:

    # event definition for "Fires"
    in the event ?gun Fires from ?ship then
      ?gun is a Shooty thing
      ?ship is a Located thing
    ...
    # rule that uses the "Fires" event as an effect
    when ... then ...
      ?x Fires from ?s
    ...
    # rule that uses the "Fires" event as a trigger
    when ?gun Fires from ?ship and ... then ...

Note that this format applies to custom events. Built-in events may deviate from it. In particular, built-in verbs are not capitalized.

## Permission conditions

Custom events may have permission conditions applied to them (built-in events may not). When a custom event is used as an effect, before it happens, its permission conditions are checked. If the event isn't allowed, it doesn't actually happen.

There are three types of permission condition declarations, shown here with our example custom event from before:

    allow the event ?gun Fires from ?ship when ...
    disallow the event ?gun Fires from ?ship when ...
    only allow the event ?gun Fires from ?ship when ...

The part after `when` is a list of conditions of the same kind as can be used after `then` in a rule (see below). For an individual permission condition declaration to be satisfied, all of the `when` conditions must be satisfied (same as for rules). For an event to be allowed:

 - At least one of the `allow` declarations must be satisfied, if there are any;
 - None of the `disallow` declarations must be satisfied; and
 - All of the `only allow` declarations must be satisfied.

Note that if no permission conditions were declared, custom events are always allowed by default.

## Noun definitions

A noun definition gives a name for a noun, and a list of other nouns and adjectives it implies. Like adjectives, nouns must start with a capital letter. Here's an example of a noun definition:

    a Worm is a Ship and Wiggly

This defines the noun `Worm`, which implies the noun `Ship` (which in turn may imply other nouns and adjectives...) and the adjective `Wiggly`. According to this definition, all `Worm`s are also `Ship`s, but a `Ship` is not necessarily a `Worm`. And when a new `Worm` is added to the game, it becomes `Wiggly`, and gains the properties of a `Wiggly` thing. It may later become not `Wiggly`. A new `Worm` also becomes all the other adjectives that `Ship` implies, and gains all of their properties.

## Rules

A rule has a triggering event and an optional set of conditions that determine when a sequence of effects happen. All three of these things (events, conditions, and effects) may contain variables, which start with a `?` character. Here is a simple example of a rule that makes `Worm`s instantly lethal on contact:

    when ?x hits ?y and
      ?x is a Worm
      ?y is Mortal
    then
      ?y is removed

Here, `?x` and `?y` are variables, and `?x hits ?y` is the triggering event. `?x is a Worm` is a condition that tests whether the thing assigned to variable `?x` can be described using the noun `Worm`. `?y is Mortal` is a condition that tests whether the thing assigned to variable `?y` can be described using the adjective `Mortal`. When an event that matches the triggering event occurs, the variables are assigned, and the conditions are tested. If all the conditions are satisfied, the effects happen, in order. Here there is one effect: `?y is removed`. This means that the thing assigned to variable `?y` is completely removed from the game along with all its adjectives and properties.

### Events

There are a few types of built-in events. The variable names used here are not part of the syntax of the events; you may use different names if you like.

    the game starts

This event happens once, and is the first event to happen.

    the clock ticks

This event happens once per animation frame, currently 20 times a second.

    ?thing is added

This event happens immediately after a new thing is added. It is best used with conditions that test what kind of thing `?thing` is and retrieve its properties.

    ?thing is removed

This event happens immediately before an existing thing is removed from the game. A rule triggered by this event will still have access to the thing's properties, but any further rules that might be triggered by that rule's effects will not.

    ?thing becomes Wiggly with frequency ?f and amplitude ?a

The `becomes` event happens when an adjective and its properties are first added to a thing, and also when any of those properties change. Here the adjective is `Wiggly`, and we capture the `frequency` property in the variable `?f`, and the `amplitude` property in the variable `?a`. The adjective may not be a variable.

    ?thing becomes not Wiggly

The `becomes not` event happens when an adjective and its properties are removed from a thing. Since the properties are already removed, they can't be assigned into variables.

    ?map reads "c" at ?position

This event happens for each character of a `Map` as it is read. `?map` is the map, `"c"` is the character (it must be a literal one-character string, not a variable), and `?position` is a `Vec2` object where the X coordinate is the column number and the Y coordinate is the line number (both starting at zero).

    ?x hits ?y

This event happens twice for every collision between `Tangible` things, once for each ordering of `?x` and `?y`.

    ?penetrator point ?point
    penetrates ?penetrated edge from ?from to ?to
    ?ticks ticks ago with velocity ?velocity

(line breaks not required but included here for ease of reading)
This event happens once for every collision between `Tangible` things, and gives more detailed information than the `?x hits ?y` event does. When two `Tangible` things collide, a point (`Vec2` object) `?point` from the `shape` of one of the things, the `?penetrator`, penetrates inside the `shape` of the other thing, the `?penetrated`. The individual line segment, or edge, that that point passed through is given by its endpoints, `?from` and `?to`. All three points are given relative to the `Space`, not the `Tangible`s they belong to. The time at which the point passed through the edge is given as a fractional number of ticks ago, `?ticks`, which will always be in the interval `[0, 1)`. And the current relative velocity of the two things is given in `?velocity` (if something isn't `Mobile` its velocity is considered to be `Vec2[0,0]`).

    ?player presses "ControlLeft"

This event happens when the player `?player` starts pressing the identified key on their keyboard (in this case, the control key on the left side of the keyboard). The string identifying the key must match the value of the `code` property of the `KeyboardEvent` object; see the [MDN page for KeyboardEvent.code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) for some tables of values. The key may also be a variable, in which case the event happens when the player starts pressing any key, and the key is assigned to the variable for use later in the rule.

    ?player releases "ControlLeft"

This event happens when the player `?player` stops pressing the identified key.

Note that the `any of`/`all of`/`one of` constructions used with the `holding down` condition (see below) do not apply to `presses`/`releases` events; use an `is in` condition instead of `any of`/`one of`, and add a `holding down` condition in order to use `all of`.

### Conditions

Conditions can be true or false, depending on the state of the game, and if true, can capture values from the game into variables that can be used later in the rule (in effects or other conditions). If any of a rule's conditions is false, the rule's effects don't happen.

    ?thing is a Worm

This condition is true when `?thing` is described by the noun `Worm`.

    ?thing is Wiggly with frequency ?f and amplitude ?a

This condition is true when `?thing` is described by the adjective `Wiggly`, and it captures the `frequency` and `amplitude` properties in the variables `?f` and `?a`, respectively.

    ?thing is not Wiggly

This condition is true when `?thing` is not described by the adjective `Wiggly`. As with the `becomes not` event, no properties can be assigned to variables.

    there is a thing ?thing which is
      Wiggly with phase ?phase
      not Mortal

This condition searches the game for a thing described by all of the given adjectives (or `not`), and if found, assigns it to the `?thing` variable and makes the condition true. If multiple things match the description, the rest of the rule applies independently for each matching thing. If a variable like `?phase` is bound to a property like `phase`, it can mean one of two things. If the variable was already assigned, it further constrains the search by requiring that the property have the same value. If the variable was not already assigned, the value of the property is assigned to the variable. More complex expressions can be bound to a property, not just variables, and in this case the first meaning is used. A `there is` condition must include at least one adjective without `not` in front of it.

    ?thing is the first thing in ?array which is
      Wiggly with phase ?phase
      not Mortal
      (and
	(?phase >= 0)
        (?phase < π)
      )

This condition searches the array `?array` for a thing described by all of the given adjectives (or `not`), which satisfies the conditions in `(and ...)`, and if any are found, assigns the first one to the `?thing` variable and makes the condition true. The `(and ...)` part is optional. Note that like `there is a thing` above, `?thing` must not already have a value before this condition is evaluated. But unlike the above, an adjective without `not` in front of it is not required (since we're already searching just the `?array` and not the entire game, we don't need that requirement to limit the search space).

    ?player is holding down "ControlLeft"

This condition is true when the player `?player` has pressed the identified key and has not yet released it.

    ?player is not holding down "ControlLeft"

This condition is true when the previously described condition is false. The `not` works similarly for all of the `holding down` conditions.

    ?player is holding down all of ["ControlLeft", "ShiftLeft"]

This condition is true when `?player` has pressed all of the listed keys and not yet released any of them.

    ?player is holding down any of ["ControlLeft", "ShiftLeft"]

This condition is true when `?player` has pressed any of the listed keys and not yet released it.

    ?player is holding down ?key which is one of ["ControlLeft", "ShiftLeft"]

This condition has the same truth value as the previous condition, but it captures the first key in the list which is being held down, and puts it in the new variable `?key`.

Usually keys and key lists will be literal values as above, but they may also be variables or value expressions.

    ?part is in ?whole

This condition is true when `?part` is an element of the array `?whole`, or when `?part` is a substring of the string `?whole`. This can be particularly useful in combination with `presses`/`releases` events, e.g. a rule starting with `when ?player presses ?key and ?key is in ["ShiftLeft", "ShiftRight"] ...` will fire when a player presses either shift key. `?part is not in ?whole` also works as you might expect.

    ?part is in ?whole at ?index

This condition is like the above, with the addition that the index in the array `?whole` where `?part` was found is put in the new variable `?index`. This isn't allowed when `?index` already has a value; use `(?part == ?whole[?index])` in that case.

    (?x <= ?y)

This condition is used to compare values. `?x` and `?y` can be arbitrary value expressions, not just variables. The comparison operation (here `<=`) can be any of the usual C-style operators: `<`, `<=`, `==`, `!=`, `>=`, or `>`. The equality operators `==` and `!=` compare `Array` and `Vec2` objects deeply (e.g. `Vec2[42,57] == Vec2[42,57]` even though they are distinct instances of `Vec2`), but are otherwise the same as JavaScript's.

### Effects

Effects describe what happens when the triggering event happens and all the conditions are satisfied. Effects happen in the order they are listed in the rule.

    a new Worm ?worm is added which is
      Wiggly with frequency 42
      Located with position ?pos

This effect adds a new thing to the game which is described by the noun `Worm` and the adjectives `Wiggly` and `Located`, with the `frequency` property of `Wiggly` set to `42`, and the `position` property of `Located` set to the value of the `?pos` variable. It also assigns the new thing to the `?worm` variable for use in later effects in the same rule. Other adjectives and their properties may apply automatically, as described in the relevant noun and adjective definitions. If a new thing is described by an adjective (even implicitly) that has properties without default values, you must supply values for those properties when the thing is added.

    a new Worm ?worm is added

This alternate form of the above effect should be used when no adjectives are explicitly specified.

    a copy ?copy of ?original is added which is
      Wiggly with frequency 42
      Located with position ?pos

This effect adds a new thing `?copy` to the game, which is a copy of `?original` that has been modified by setting the adjective properties listed. Like `a new ... is added`, the `which is ...` part may be omitted, in which case the copy is identical to the original except for the thing number. This is a (somewhat) shallow copy: any other things referenced by the copied adjective properties are not themselves copied, but rather shared between the copy and the original.

    ?thing is removed

This effect removes a previously-added thing from the game completely, including all of its adjectives and properties.

    ?thing becomes
      Wiggly with frequency 42
      Located with position ?pos

This effect causes `?thing` to be described by the adjectives that follow, with the given property values. For now, it's up to you to include any other adjectives that those adjectives imply; it's not done automatically like with `a new Worm ?worm is added`.

    ?map is read

This effect causes `?map` to be read, which causes a `map reads` event for each character in the `map` string of `?map` (except for line break characters).

    let ?x be (?y + 42)

This effect assigns the value of the expression the right (`(?y + 42)` in this case) to the variable on the left (`?x`) for use in later effects in the same rule. `let` may also be used as a condition, in which case it is always true (regardless of the assigned value), and the variable may be used in later conditions and effects in the same rule.

    chat (?name + " won!")

This effect sends a system message in the chat box containing the value of the expression `(?name + " won!")`. System messages appear in italics and begin with two bold asterisks.

    debug (?y + 42)

This effect prints the value of the expression `(?y + 42)` to the browser console for debugging purposes.

### Value expressions

Several conditions and effects, as well as properties of `become` events, can use value expressions instead of just variables in some places. A value expression can be one of several things:

A variable as always.

A numeric constant, `π`, `e`, or `∞` (or equivalently `PI`, `E`, or `INFINITY`), a boolean constant `true` or `false`, or the `nothing` constant (equivalent to `null` in JavaScript).

A decimal number, e.g. `1.23`. If the decimal point is included, there must be some digits on both sides of it, e.g. `1.` and `.23` are not allowed (use `1.0` or `0.23` instead).

A string in double quotes, e.g. `"Hello, world!\n"`. This supports escape sequences as in JSON.

Arithmetic, comparison, and boolean operations with other value expressions as the operands. These obey the usual precedence rules, but at the top level you must include parentheses, e.g. `debug (?x + ?y * ?z)` is OK, and does the multiplication before the addition, but `debug ?x + ?y * z` won't parse. In addition to the usual addition `+`, subtraction `-`, multiplication `*`, division `/`, and remainder `%` operators, you also have cross product `x` or `×`, and dot product `.` or `·` operators for use with `Vec2` operands. The other operators can also work with `Vec2`s in certain ways, as long as at least the first operand is a `Vec2`. With `Vec2`s, `*` means scaling. And with strings, `+` means concatenation. Boolean operations are spelled out: `and`, `or`, and `not` (not `&&`, `||`, and `!`).

Math functions with one argument in parentheses, including trigonometric functions, `abs`, `sign`, `ceil`, `floor`, `round`, `sqrt`, `cbrt`, various logarithms, and exponentials. These use the methods on the [JavaScript `Math` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math). For now, methods with more than one argument aren't supported.

Constructors for a few JavaScript object types, with arguments in square brackets (no `new` keyword required):

    Array[?length]
    Interface[?player]
    PlayingSound[?audible, ?soundable]
    SpatialIndex[]
    Vec2[?x, ?y]

Unique references to things by their names and optionally their types, e.g.:

    the thing "Charlie" # the thing which is Named with name "Charlie"
    the Space "Foo" # the thing which is a Space and is named "Foo"
    the Soundable thing "Mew" # the thing which is Soundable and named "Mew"
    the thing ?foo # the thing which is named by the contents of ?foo

(References like this that could refer to more than one thing, or refer to
nothing, cause an error.)

Array literals in square brackets, e.g. `[1, 2, "buckle my shoe"]`.

Array/string indexing, e.g. `?array[?index]`. Indexes start from 0. Indexing into a string yields a one-character string, and the index counts characters (not bytes).

[SVG](https://www.w3.org/TR/SVG11/) literals. These are used for the `graphics` property of the built-in adjective `Visible`. An SVG literal must be a single valid SVG element of the type `SVGGraphicsElement`, which includes `<g>`, `<path>`, `<rect>`, `<circle>`, `<ellipse>`, `<line>`, `<polyline>`, `<polygon>`, and `<text>`. It must not include any `<script>` elements or event handler attributes like `onclick="launchTheNukes()"`.

SVG literals may include variables, whose values are then turned into strings and included in the SVG. `Array` and `Vec2` objects turn into flat, comma-separated strings, so for example you can use a variable `?shape` containing an `Array of Vec2 objects` like `[Vec2[1,2],Vec2[3,4],Vec2[5,6]]` in the `points` attribute of a `<polygon>` element like this: `<polygon points="?shape" ... />`, and it will turn into `<polygon points="1,2,3,4,5,6" ... />`. Variables may not be used as (part of) a tag name (e.g. `<?foo ... />`) or an attribute name (e.g. `<polygon ?foo="..." ... />`), nor may they contain any of the characters `<`, `>`, `=`, `'`, or `"` when they are interpolated.

## Uses of other `.yp` files

One file can `use` another file (specified as a URL in a string), meaning that the other file is loaded as if its contents were included in place of the `use` statement. Only the first `use` of a given URL has this effect; later `use`s of the same URL are ignored.

Standard libraries all have URLs of the form `standard:foo.yp`, where `foo` is the name of the library. Other libraries have (CORS-enabled) `http:` or `https:` URLs. Relative URLs are also allowed, but always use the location of `ypilot.html` as the thing they're relative to, so they're not as useful as you might think.

For example, someone might host a file like this at `http://www.example.com/ypilot/fish.yp`:

    use "standard:mortal.yp"

    a Fish is Mortal

Which uses the standard library called `mortal`, which defines the adjectives `Mortal` and `Respawning` (among other things). Then you could write another file like this to use that file:

    use "standard:mortal.yp"
    use "http://www.example.com/ypilot/fish.yp"

    a Salmon is a Fish and Respawning

In this case, the `mortal.yp` standard library is loaded first, and then `fish.yp` is loaded. The `use` statement in `fish.yp` sees that `mortal.yp` is already loaded and does nothing. So we only see the definitions of `Mortal` and `Respawning` once.

## Base library

Several adjectives, and a few related nouns, events, and rules, are defined in YPilot's base library, [`base.yp`](base.yp). These are defined in the YPiloy language, but since the core JavaScript code refers to them, they are always included.

`base.yp` itself uses [`sound.yp`](sound.yp) to define `Audible` and make other sound-related definitions, so that file is also effectively part of the base library, and is always included.

See those files for the precise definitions, as well as comments describing how each is used by the core JavaScript code, and may be used by your `.yp` code.

## Standard libraries

See the index of standard library `.yp` files here: ([markdown](stdlib.md)) ([html](stdlib.html)).
